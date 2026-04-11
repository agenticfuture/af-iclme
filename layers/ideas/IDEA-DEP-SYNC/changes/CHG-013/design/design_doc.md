# Design Doc: Dependency Synchronization

## Objective
Restore API functionality by ensuring all dependencies declared in `pyproject.toml` are correctly locked and installed in the runtime environment.

## Logic
1. **Consistency Check**: Verify `pyproject.toml` contains `minio` and `python-multipart`. (Verified: OK).
2. **Lock Synchronization**: Run `uv lock` in the `app/ingress/api/` directory to update `uv.lock`.
3. **Environment Synchronization**: Run `uv sync` to install missing packages into the `.venv`.
4. **Validation**: Check package visibility.

## Risks
- Version conflicts between new packages and existing AI tooling (LangChain/LlamaIndex).
- Environment mismatch between host and container if not handled carefully.

## Expected Outcome
`import minio` succeeds in the API runtime.
