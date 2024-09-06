FROM node:latest

# Install aws-cli and aws-cdk
RUN apt-get update && apt-get install -y less vim curl unzip sudo \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && sudo ./aws/install \
  && rm awscliv2.zip \
  && npm install -g aws-cdk

USER node

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Install Linuxbrew
RUN git clone https://github.com/Homebrew/brew ~/.linuxbrew/Homebrew \
  && mkdir ~/.linuxbrew/bin \
  && ln -s ~/.linuxbrew/Homebrew/bin/brew ~/.linuxbrew/bin
ENV PATH $PATH:~/.linuxbrew/bin

WORKDIR /app
COPY . /app

CMD ["/bin/bash"]