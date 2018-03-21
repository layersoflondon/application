# Use oficial Ruby 2.5
FROM ruby:2.5
# Install dependencies:
# - build-essential: To ensure certain gems can be compiled
# - nodejs: Compile assets
# - npm: Install node modules
# - yarn: Install & manage node modules [should make npm obsolete]
# - libpq-dev
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -qq -y build-essential nodejs yarn \
    libpq-dev \
    mysql-client \
    sqlite3 \
    openssl \
    openssh-server
# Command line collection runner for Postman
RUN npm install -g newman
# Setup ssh server
RUN mkdir /var/run/sshd
RUN mkdir /root/.ssh
RUN echo 'root:root' | chpasswd
# Create unprivileged user, prosaically called app
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app
# Copy files into the container
COPY ./src/Gemfile ./src/Gemfile.lock $HOME/lol/
COPY ./src/package.json ./src/yarn.lock $HOME/lol/
# Chown copies files
RUN chown -R app:app $HOME/*
# Set working directory
WORKDIR $HOME/lol
# Make user app own files
USER app
# Install ruby gem dependencies
RUN bundle install
# Install yarn dependencies
RUN yarn install --no-cache --frozen-lockfile