FROM ruby:2.5

RUN apt-get update \
    && apt-get -y install \
    build-essential  \
    libpq-dev \
    mysql-client \
    sqlite3 \
    apt-transport-https


# Add Yarn repository
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Update
RUN apt-get update -y

# Install Yarn
RUN apt-get install yarn -y

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash

RUN apt-get install nodejs


RUN mkdir /app

WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock

COPY . /app

RUN bundle install

