# First downloadig the base-image used int he dockerfile

FROM ubuntu:latest

# Adding labels to identify the maintainer of this image

LABEL version="0.0.1"
LABEL maintainer="yashppatilk23@gmail.com"

# Updating the image to the latest packages

RUN apt-get update && apt-get upgrade -y

# Install NGINX to test.

RUN apt-get install nginx -y

# Expose port 80

EXPOSE 80

# last is the actual command to start up NGINX within our Container

CMD [ "nginx","-g","daemon off;"]

