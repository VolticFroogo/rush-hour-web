# Get Node for app compilation.
FROM node:14.15.4 as node

# Set workdir.
WORKDIR /app

# Install dependencies.
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app.
COPY . .

# Build the app.
RUN npm run build

# Get Nginx for hosting the generated files.
FROM nginx:1.19.6

# Copy the files to host with Nginx.
COPY --from=node /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
