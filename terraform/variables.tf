variable "region" {
    default = "us-east-1"  
}

variable "key_name" {
  
}

variable "public_key" {
  description = "The public key for SSH access"
}

variable "private_key" {
  description = "The private key for SSH access"
  sensitive   = true
}

variable "domain_name" {
  description = "The domain name to associate with the EC2 instance"
}

variable "route53_zone_id" {
  description = "The ID of the Route 53 hosted zone"
}

variable "subdomain" {
  description = "The subdomain to associate with the resources"
}