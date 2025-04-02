provider "aws" {
  region = "eu-north-1" # You can change region
}

resource "aws_instance" "ecommerce" {
  ami           = "ami-0c55b159cbfafe1f0"  # Ubuntu 20.04 (check your region's AMI)
  instance_type = "t2.micro"
  key_name      = "your-key-name" # Replace with your AWS EC2 key pair

  vpc_security_group_ids = [aws_security_group.ecommerce_sg.id]

  tags = {
    Name = "EcommerceInstance"
  }

  provisioner "local-exec" {
    command = "echo ${self.public_ip} > inventory.ini"
  }
}

resource "aws_security_group" "ecommerce_sg" {
  name        = "ecommerce-sg"
  description = "Allow HTTP, SSH, Vite, and API access"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend Vite"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
