# Project name
PROJECT_NAME := life-restart

# Docker registry
DOCKER_REGISTRY ?= 

# Docker image name and tag
ifeq ($(DOCKER_REGISTRY),)
    IMAGE_NAME := $(PROJECT_NAME)
else
    IMAGE_NAME := $(DOCKER_REGISTRY)/$(PROJECT_NAME)
endif
IMAGE_TAG := latest

# Default make command
all: image push

# Docker build command
image:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Docker save command
save:
	docker save -o $(PROJECT_NAME)_$(IMAGE_TAG).tar $(IMAGE_NAME):$(IMAGE_TAG)

# Docker push command
push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: all image save push
