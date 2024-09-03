FROM node:latest

RUN apt-get update && apt-get install -y less vim curl unzip sudo \
  && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && sudo ./aws/install \
  && rm awscliv2.zip \
  && npm install -g aws-cdk

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

WORKDIR /app
COPY . /app

CMD ["/bin/bash"]