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

RUN mkdir /root/.ssh
RUN echo "root:root" | chpasswd
# RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config
# RUN mkdir /var/run/sshd

ADD ./src/Gemfile /opt/debugging/debugger
ADD ./src/Gemfile.lock /opt/debugging/debugger.pub
RUN cat /opt/debugging/debugger.pub > /root/.ssh/authorized_keys

# Set working directory
RUN mkdir -p /app
WORKDIR /app

# bundle gem dependencies
ADD ./src/Gemfile /app/
ADD ./src/Gemfile.lock /app/
RUN bundle install
