FROM ruby:2.6

LABEL maintainer="ed@error.agency"

RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
    apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | \
  tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
    nodejs \
    yarn

RUN gem install bundler -v '2.0.1'

COPY Gemfile* /usr/src/app/
WORKDIR /usr/src/app
ENV BUNDLE_PATH /gems
RUN bundle install

#COPY node_modules /usr/src/app/node_modules
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --modules-folder /node_modules

COPY . /usr/src/app/

CMD ["bin/rails", "s", "-b", "0.0.0.0"]