#!/bin/bash

# We need to install dependencies only for Docker
[[ ! -e /.dockerenv ]] && exit 0

set -xe

apt-get install -y libpq-dev libxml2-dev libxslt1-dev libpng-dev \
&& docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
&& docker-php-ext-install pdo_pgsql pgsql xsl \
&& pecl install xdebug-2.6.0 \
&& docker-php-ext-enable xdebug \
&& docker-php-ext-install gd


#&& docker-php-ext-install pdo_pgsql pgsql xsl zip \
