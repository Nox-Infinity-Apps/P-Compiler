.PHONY: install run lint test format clean

install:
	poetry install

run:
	poetry run uvicorn index:app --reload

lint:
	poetry run flake8 .

test:
	poetry run pytest

format:
	poetry run black .

clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete