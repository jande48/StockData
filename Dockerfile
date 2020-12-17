FROM ubuntu:18.04

RUN apt-get update -y

RUN apt-get install python3-pip -y

RUN apt-get install gunicorn -y

RUN pip3 install flask

COPY requirements.txt requirements.txt

COPY algoPlatform1_project /opt/
COPY react-frontend /opt/
COPY run.py /opt/

RUN pip3 install -r requirements.txt

WORKDIR /opt/

CMD ["python","run.py"]
