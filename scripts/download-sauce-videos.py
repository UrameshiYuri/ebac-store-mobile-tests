"""Download real-device recordings after WDIO has closed its sessions."""
import base64
import json
import os
from pathlib import Path
import re
import time
import urllib.error
import urllib.request


def main():
    sessions = sorted(Path('artifacts/sessions').glob('*.json'))
    if not sessions:
        raise SystemExit('Nenhuma sessão Sauce foi criada; não há vídeo para baixar.')
    auth = base64.b64encode(
        f"{os.environ['SAUCE_USERNAME']}:{os.environ['SAUCE_ACCESS_KEY']}".encode()
    ).decode()
    output = Path('artifacts/videos')
    output.mkdir(parents=True, exist_ok=True)
    missing = []
    for session_file in sessions:
        session = json.loads(session_file.read_text())
        job, region = session['id'], session['region']
        if not re.fullmatch(r'[a-zA-Z0-9-]+', job) or region not in (
            'us-west-1', 'us-east-4', 'eu-central-1'
        ):
            raise ValueError('Identificador de sessão ou região inválidos')
        url = f'https://api.{region}.saucelabs.com/v1/rdc/jobs/{job}/video.mp4'
        target = output / f'{job}.mp4'
        # Encoding is asynchronous after session shutdown; allow up to ~3 minutes.
        for attempt in range(12):
            try:
                request = urllib.request.Request(url, headers={'Authorization': f'Basic {auth}'})
                with urllib.request.urlopen(request, timeout=30) as response:
                    data = response.read()
                if len(data) < 12 or data[4:8] != b'ftyp':
                    raise ValueError('Resposta ainda não contém um MP4 válido')
                target.write_bytes(data)
                print(f'Vídeo salvo: {target}')
                summary = os.environ.get('GITHUB_STEP_SUMMARY')
                if summary:
                    with open(summary, 'a') as stream:
                        stream.write(f'\nVídeo da sessão `{job}`: `{target}` no artifact de evidências.\n')
                break
            except urllib.error.HTTPError as error:
                if error.code not in (404, 409, 429, 500, 502, 503, 504):
                    raise SystemExit(f'Falha ao baixar vídeo: HTTP {error.code}') from None
            except (urllib.error.URLError, TimeoutError, ValueError):
                pass
            if attempt < 11:
                time.sleep(15)
        else:
            missing.append(job)
    if missing:
        raise SystemExit('Vídeo indisponível após tentativas: ' + ', '.join(missing))


if __name__ == '__main__':
    main()
