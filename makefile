# Project name
PROJECT_NAME := life-restart

# Docker registry
DOCKER_REGISTRY ?= 

# Extract latest Git tag
GIT_TAG := $(shell git describe --tags --abbrev=0)

# Docker image name and tag
ifeq ($(DOCKER_REGISTRY),)
    IMAGE_NAME := $(PROJECT_NAME)
else
    IMAGE_NAME := $(DOCKER_REGISTRY)/$(PROJECT_NAME)
endif
IMAGE_TAG := $(GIT_TAG)

# Default make command
all: image push push-latest

# Docker build command
image:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Docker save command
save:
	docker save -o $(PROJECT_NAME)_$(IMAGE_TAG).tar $(IMAGE_NAME):$(IMAGE_TAG)

# Docker push command
push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

push-latest:
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(IMAGE_NAME):latest
	docker push $(IMAGE_NAME):latest

.PHONY: all image save push push-latest
