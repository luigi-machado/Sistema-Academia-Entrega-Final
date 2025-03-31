FROM python:3.9-slim

WORKDIR /api

COPY requirements.txt /api/

RUN apt-get update && apt-get install -y \
	libpq-dev \
	gcc \
	&& rm -rf /var/lib/apt/lists/*


RUN  pip install --no-cache-dir -r requirements.txt

COPY . /api/

EXPOSE 5000 

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

CMD ["flask","run","--host=0.0.0.0"]