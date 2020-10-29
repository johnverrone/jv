resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.location

  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "${var.cluster_name}-node-pool"
  location   = var.location
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-micro"

    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

output "k8s_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Nmae"
}