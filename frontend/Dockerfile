# Use an official NGINX image as a parent image
FROM nginx:stable-alpine

# Set the working directory to the NGINX html directory
WORKDIR /usr/share/nginx/html

# Remove the default NGINX welcome page
RUN rm -rf ./*

# Copy your frontend files (HTML, CSS, JS, images) from your local machine
# to the NGINX html directory in the container
COPY . .

# Expose port 80 to the outside world
EXPOSE 80

# The default NGINX command will start the server, so no CMD is needed

