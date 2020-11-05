variable "project" {
  description = "The GCP Project"
  default     = "jv-dev13"
}

variable "cluster_name" {
  description = "The name for the GKE cluster"
  default     = "main-cluster"
}

variable "location" {
  description = "the location to use for the primary k8s cluster"
  default     = "us-central1-a"
}

variable "network" {
  description = "the lname of the compute network to use for the primary k8s cluster"
  default     = "default"
}