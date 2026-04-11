# .PHONY: up down logs \
#         new-executor new-adapter \
#         migrate seed \
#         prefect-onboard prefect-ingest

# include make/build.mk

DC := docker compose
MIGRATIONS_SVC := migrations

REPO_ROOT := $(shell pwd)
# ==============================
# ServiceGen Platform Makefile
# ==============================

SHELL := /bin/bash
PROJECT := servicegen
NAMESPACE := servicegen
KIND_CLUSTER := servicegen
HELM_RELEASE := servicegen
HELM_DIR := helm/servicegen


# Extend this list as needed
# IMAGES = \
# 	service-gen-api \
# 	service-gen-saas \
# 	service-gen-ai-chatbot \
# 	service-gen-agent-workspace

IMAGES = \
	rasa/rasa
#	rasa
#	redis


# --- Configuration ---
REGISTRY      := my-reg.ovh.net
PROJECT_NAME  := service-gen
NAMESPACE     := production
TAG           := 0.8.0  #$(shell git rev-parse --short HEAD)

# Service Paths
API_DIR       := ./app/ingress/api
SAAS_DIR      := ./ui-apps/service-gen-saas
WORKSPACE_DIR := ./ui-apps/service-gen-agent-workspace
CHATBOT_DIR   := ./ui-apps/service-gen-ai-chatbot

SERVICES      := api saas workspace chatbot


.PHONY: structure #scaffold

structure:
	# Root

	@touch docker-compose.dev.yml
	@touch .env
	@touch README.md

	@touch .env.template
	@touch .env.dev 
	@touch .env.staging
	@touch .env.prod
	@touch requirements.txt
	@touch .gitignore
	@touch prefect.yaml # Prefect deployment definition
	@touch .prefectignore

	# ingress 
	mkdir -p ingress

	# api 
	mkdir -p ingress/api
	mkdir -p ingress/api/routes

	mkdir -p ingress/api/routes/onboarding

	@touch ingress/api/server.py
	@touch ingress/api/routes/routes.yml 
	@touch ingress/api/routes/onboarding/routes.yml 


	# Runtime
	
	mkdir -p runtime/core
	touch runtime/main.py	
	touch runtime/core/runtime.py
	touch runtime/core/registry.py
	touch runtime/core/bootstrap.py
	touch runtime/core/errors.py
	touch runtime/core/loader.py
	touch runtime/core/discovery.py
	touch runtime/core/tools.py
	touch runtime/container.py
	
	# control plane
	mkdir -p control_plane
	mkdir -p control_plane/migrations/
	mkdir -p control_plane/migrations/sql
	mkdir -p control_plane/migrations/alembic/versions
	mkdir -p control_plane/seeds/
	mkdir -p control_plane/workflow/
	mkdir -p control_plane/executors/
	mkdir -p control_plane/runtime/
	touch control_plane/migrations/migrate_001.py
	touch control_plane/seeds/seeds_001.py
	touch control_plane/workflow/prefect_flows.py
	touch control_plane/seeds/faker_tool.py
	touch control_plane/workflow/generate_seed_data.py 
	touch control_plane/runtime/runtime.py
	touch control_plane/runtime/main.py
	touch control_plane/runtime/bootstrap.py
	touch control_plane/runtime/executor_registry.py
	touch control_plane/executors/seed_executor.py
	touch control_plane/workflow/generate_seed_data.yml 

	touch control_plane/migrations/sql/001_extensions.sql
	touch control_plane/migrations/sql/010_tenants.sql
	touch control_plane/migrations/sql/020_services.sql
	touch control_plane/migrations/sql/030_bots.sql
	touch control_plane/migrations/sql/040_knowledge_assets.sql
	touch control_plane/migrations/sql/050_ka_sources.sql
	touch control_plane/migrations/sql/060_ingestion_runs.sql
	touch control_plane/migrations/sql/070_documents.sql
	touch control_plane/migrations/sql/080_vector_collections.sql
	touch control_plane/migrations/sql/090_cases.sql
	touch control_plane/migrations/sql/100_rls.sql

	touch control_plane/migrations/alembic/env.py 
	touch control_plane/migrations/alembic/versions/migrations_v001.py
	touch control_plane/migrations/alembic/alembic.ini



	# Executors
	mkdir -p executors/tools
	mkdir -p executors/onboarding/workflows
	mkdir -p executors/omnichannel/workflows
	mkdir -p executors/case/workflows
	touch executors/onboarding/manifest.json
	touch executors/onboarding/instructions.yaml
	touch executors/onboarding/workflows/register_tenant.yaml
	touch executors/onboarding/executor.py
	touch executors/omnichannel/manifest.json
	touch executors/omnichannel/instructions.yaml
	touch executors/omnichannel/workflows/ingest_message.yaml
	touch executors/omnichannel/executor.py
	touch executors/case/manifest.json
	touch executors/case/instructions.yaml
	touch executors/case/workflows/open_case.yaml
	touch executors/case/workflows/open_from_interaction.yaml
	touch executors/case/executor.py

	#workflows

	mkdir -p workflows/prefect/omnichannel
	mkdir -p workflows/prefect/tenant_registration
	mkdir -p workflows/prefect/cases 
	@touch workflows/prefect/cases/open_case.yaml
	@touch workflows/prefect/tenant_registration/tenant_register.yaml
	@touch workflows/prefect/prefect_flows.py

	# Adapters
	mkdir -p executors/adapters/db
	mkdir -p executors/adapters/log
	mkdir -p executors/adapters/auth
	mkdir -p executors/adapters/policy
	mkdir -p executors/adapters/http
	touch executors/adapters/db/postgres.py
	touch executors/adapters/db/manifest.yml
	touch executors/adapters/log/jsonlog.py
	touch executors/adapters/log/manifest.yml
	touch executors/adapters/auth/keycloak.py
	touch executors/adapters/auth/manifest.yml
	touch executors/adapters/policy/opa.py
	touch executors/adapters/policy/manifest.yml
	touch executors/adapters/http/client.py
	touch executors/adapters/http/manifest.yml

# 	mkdir -p servicegen/adapters/db
# 	mkdir -p servicegen/adapters/log
# 	mkdir -p servicegen/adapters/auth
# 	mkdir -p servicegen/adapters/policy
# 	mkdir -p servicegen/adapters/http
# 	touch servicegen/adapters/db/postgres.py
# 	touch servicegen/adapters/log/jsonlog.py
# 	touch servicegen/adapters/auth/keycloak.py
# 	touch servicegen/adapters/policy/opa.py
# 	touch servicegen/adapters/http/client.py

	# UI
	mkdir -p ui/app/admin/onboarding
	mkdir -p ui/app/omni/test
	mkdir -p ui/app/cases
	mkdir -p ui/kernel
	mkdir -p ui/engines
	mkdir -p ui/units/onboarding/workflows
	mkdir -p ui/units/onboarding/views
	mkdir -p ui/units/omnichannel/views
	mkdir -p ui/units/case/views

	touch ui/Dockerfile
	touch ui/package.json
	touch ui/next.config.js
	touch ui/app/layout.tsx
	touch ui/app/page.tsx
	touch ui/app/admin/onboarding/page.tsx
	touch ui/app/omni/test/page.tsx
	touch ui/app/cases/page.tsx
	touch ui/kernel/bootstrap.ts
	touch ui/kernel/runtime.ts
	touch ui/kernel/store.ts
	touch ui/engines/ui_engine.ts
	touch ui/engines/form_engine.ts
	touch ui/engines/http_engine.ts
	touch ui/units/onboarding/manifest.json
	touch ui/units/onboarding/events.yaml
	touch ui/units/onboarding/instructions.yaml
	touch ui/units/onboarding/workflows/load.yaml
	touch ui/units/onboarding/workflows/validate.yaml
	touch ui/units/onboarding/workflows/submit.yaml
	touch ui/units/onboarding/views/TenantRegistrationForm.tsx
	touch ui/units/onboarding/views/Success.tsx
	touch ui/units/omnichannel/views/OmniTester.tsx
	touch ui/units/case/views/CasesWorkspace.tsx




scripts-build:
	docker compose -f docker-compose.scripts.yml up --build -d 

scripts-up:
	docker compose -f docker-compose.scripts.yml up  -d 

scripts-down:
	docker compose -f docker-compose.scripts.yml up down

scripts-run:
#	docker exec -it python-scripts /bin/bash
#	copy the docker-compose.dev and the .env files into the container as well
#	cp docker-compose.dev.yml ./env/scripts/docker-compose.dev.yml
	docker exec -it python-scripts /app/.venv/bin/python  -m scripts.compose_env_extract

scripts-uv:
	docker exec -it python-scripts uv sync --no-dev

scripts-env-extract:
#	basic
	python tools/compose_env_extract.py --compose docker-compose.yml

#   Include commented services (best-effort):
	python tools/compose_env_extract.py --compose docker-compose.yml --include-commented

#	Also merge inline env vars into existing env_file (append missing keys):
	python tools/compose_env_extract.py --merge-into-existing-envfiles

scripts-env-sync:

	docker exec -it python-scripts /app/.venv/bin/python  -m scripts.compose_env_sync

scripts-env-update:
#	Usage:
	python tools/compose_env_sync.py --manifest servicegen-compose-env.manifest.yml

helm-chart:
#	Usage:
	docker exec -it python-scripts /app/.venv/bin/python  -m  scripts.helm_gen_from_manifest

#	Overwrite existing keys:
#	python tools/compose_env_sync.py --overwrite
#

# ------------------------------
# Tooling checks
# ------------------------------

#.PHONY: prereq

prereq-install-k8s:
	@echo "🔍 Checking prerequisites..."
	@command -v docker >/dev/null || (echo "❌ Docker not installed" && exit 1)
	@command -v kubectl >/dev/null || (echo "🔧 Installing kubectl..." && brew install kubectl)
	@command -v helm >/dev/null || (echo "🔧 Installing helm..." && brew install helm)
	@command -v kind >/dev/null || (echo "🔧 Installing kind..." && brew install kind)
	@echo "✅ All prerequisites satisfied"


.PHONY: cluster-up
cluster-up:
	@echo "☸️  Ensuring local Kubernetes cluster exists..."
	@if ! kind get clusters | grep -q $(KIND_CLUSTER); then \
		echo "🚀 Creating kind cluster $(KIND_CLUSTER)"; \
		kind create cluster --name $(KIND_CLUSTER); \
	else \
		echo "✔ kind cluster $(KIND_CLUSTER) already exists"; \
	fi

	@kubectl get ns $(NAMESPACE) >/dev/null 2>&1 || \
		kubectl create ns $(NAMESPACE)


.PHONY: cluster-down
cluster-down:
	@echo "🧹 Deleting kind cluster $(KIND_CLUSTER)"
	kind delete cluster --name $(KIND_CLUSTER)

# ------------------------------
# Load images into kind
# ------------------------------

.PHONY: load-images
load-images:
	@echo "📤 Loading Docker images into kind..."
	@for img in $(IMAGES); do \
		echo "➡️  Loading $$img"; \
		kind load docker-image $$img:3.6.20-full --name $(KIND_CLUSTER); \
	done
#$img:latest


helm-rasa:
	cd $(REPO_ROOT) && \
	helm upgrade --install rasa ./helm/servicegen/charts/rasa \
	  --namespace servicegen \
	  --create-namespace

helm-kompose-rasa:
	cd $(REPO_ROOT) && \
	helm upgrade --install rasa ./kompose-test-rasa/\
	  --namespace servicegen \
	  --create-namespace

k8s-pods: 
	kubectl get pods --namespace servicegen

k8s-inspect-pod:
	kubectl describe pod rasa-rasa-5594bd885d-srlrb  -n servicegen

k8s-logs-pod:
	kubectl logs rasa-697d8b8554-rn2lw   -n servicegen
#	kubectl logs rasa-rasa-5d8d5454dc-kh7xm -n servicegen --previous

k8s-remove-pod:
	helm uninstall rasa -n servicegen || true
#	kubectl delete deployment rasa-rasa -n servicegen || true
#	kubectl delete pod rasa-rasa-5d8d5454dc-kh7xm -n servicegen


db-init:
	psql -f db/sql/bootstrap.sql
#	psql -f sql/init.sql

db-roles:
	psql -f db/sql/roles.sql

db-rls:
	psql -f db/sql/rls.sql

db-migrate: ##	local
	alembic revision --autogenerate -m "change"
	alembic upgrade head

#	prod
#	alembic upgrade head
#	pytest db/tests

#	prod
#	alembic upgrade head

db-seed:
	python db/seeds/seed_demo.py 10 50

db-run:
	python db/main.py

kompose-gen-chart:
	kompose convert -f ./docker-compose.rasa.yml -c -o kompose-test-rasa
#	kompose convert -f ./path/to/docker-compose.yaml - -o ./output-folder
#	kompose convert -f ./path/to/docker-compose.yaml --chart -o ./output-folder


# --- 1. Build & Push (Staging/Prod) ---
.PHONY: build
build: ## Build all production-ready images
	docker compose  -f docker-compose.staging.yaml build 

# 	docker build -t $(REGISTRY)/$(PROJECT_NAME)-api:$(TAG) -f Dockerfile.api.prod .
# 	docker build -t $(REGISTRY)/$(PROJECT_NAME)-saas:$(TAG) $(SAAS_DIR)
# 	docker build -t $(REGISTRY)/$(PROJECT_NAME)-workspace:$(TAG) $(WORKSPACE_DIR)
# 	docker build -t $(REGISTRY)/$(PROJECT_NAME)-chatbot:$(TAG) $(CHATBOT_DIR)
# -f docker-compose.yaml

.PHONY: push
push: ## Push images to OVH Private Registry
	docker compose -f docker-compose.staging.yaml push

# 	docker push $(REGISTRY)/$(PROJECT_NAME)-api:$(TAG)
# 	docker push $(REGISTRY)/$(PROJECT_NAME)-saas:$(TAG)
# 	docker push $(REGISTRY)/$(PROJECT_NAME)-workspace:$(TAG)
# 	docker push $(REGISTRY)/$(PROJECT_NAME)-chatbot:$(TAG)
# -f docker-compose.yaml 

# --- 2. Kubernetes / Helm Deployment ---
.PHONY: convert
convert: ## Convert Compose to Helm Chart (Umbrella style)
	kompose convert -f docker-compose.yaml -f docker-compose.staging.yaml -c -o ./helm-chart
	@echo "Refactoring chart name..."
	sed -i 's/name: .*/name: $(PROJECT_NAME)/' ./helm-chart/Chart.yaml

.PHONY: secrets
secrets: ## Inject local .env files into K8s Secrets
	kubectl create secret generic $(PROJECT_NAME)-api-secrets --from-env-file=$(API_DIR)/.env.local -n $(NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -
	kubectl create secret generic $(PROJECT_NAME)-ui-secrets --from-env-file=$(SAAS_DIR)/.env.local -n $(NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -

.PHONY: deploy
deploy: push secrets ## Full Deployment: Build, Push, and Install via Helm
	helm upgrade --install $(PROJECT_NAME) ./helm-chart --namespace $(NAMESPACE) --set image.tag=$(TAG)

# --- 3. Local Development ---
.PHONY: dev
dev: ## Run local development environment
	docker compose up --build

.PHONY: clean
clean: ## Remove local containers and temporary helm charts
	docker compose down
	rm -rf ./helm-chart

# .PHONY: help
# help: ## Show this help message
# 	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-up:
	docker compose -f docker-compose.generated.yml up  -d 
#	docker compose -f docker-compose.dev.yml up --build -d 
#	docker compose -f docker-compose.generated.yml up  prefect
#	docker compose -f docker-compose.generated.yml  up -d --force-recreate prefect

docker-down:
	docker compose -f docker-compose.generated.yml down 
#	docker compose -f docker-compose.generated.yml down  prefect
#	docker compose -f docker-compose.generated.yml down  postgres -v 

#	-v
#	

docker-restart:
	docker compose -f docker-compose.generated.yml down 
	docker compose -f docker-compose.generated.yml up  -d 
#	docker compose -f docker-compose.generated.yml down  prefect
#	docker compose -f docker-compose.generated.yml down  postgres -v 

docker-build-up:
	docker compose -f docker-compose.dev.yml up --build -d 
#	
down:
	docker compose -f docker-compose.dev.yml down 
#-v

logs:
	docker compose -f docker-compose.dev.yml logs -f


db-migrate:
	$(DC) exec $(MIGRATIONS_SVC) \
		alembic upgrade head
#python -m runtime.seed_control_plane
#python prefect_flows onboard_demo "Generate Seed Data Workflow"
db-seed:
	$(DC) exec $(MIGRATIONS_SVC) \
		python -m ./workflows/generate_seed_data.py 

# Scaffold a new executor unit: make new-executor NAME=billing
new-executor:
	@if [ -z "$(NAME)" ]; then echo "NAME required. ex: make new-executor NAME=billing"; exit 1; fi
	mkdir -p executors/$(NAME)/workflows
	touch executors/$(NAME)/executor.py
	touch executors/$(NAME)/instructions.yaml
	touch executors/$(NAME)/manifest.json
	touch executors/$(NAME)/workflows/example.yaml
	@echo "✅ created executors/$(NAME)"

# Scaffold a new adapter: make new-adapter NAME=cache/redis
new-adapter:
	@if [ -z "$(NAME)" ]; then echo "NAME required. ex: make new-adapter NAME=cache/redis"; exit 1; fi
	mkdir -p adapters/$(NAME)
	touch adapters/$(NAME)/__init__.py
	touch adapters/$(NAME)/impl.py
	@echo "✅ created adapters/$(NAME)"

migrate:
	docker compose -f docker-compose.dev.yml exec api python -m runtime.control_plane.migrate

seed:
	docker compose -f docker-compose.dev.yml exec api python -m runtime.control_plane.seeds

prefect-onboard:
	docker compose -f docker-compose.dev.yml exec api python -m runtime.control_plane.prefect_flows onboard_demo

prefect-ingest:
	docker compose -f docker-compose.dev.yml exec api python -m runtime.control_plane.prefect_flows ingest_demo


postgres-init-dbs:
	@for f in postgres/init/*.sql; do \
		echo "▶ Running $$f"; \
		docker exec -i postgres psql -U postgres < "$$f"; \
	done


#docker compose rm -f docker-compose.generated.yml  -v postgres

cert-gen:
	mkcert "*.servicegen.local"
#	mkcert localhost servicegenapi.local servicegensaas.local servicegenbot.local keycloak.local prefect.local
#	rm ../*.pem

git-add:
#	    modified:   .env.local
#         modified:   Makefile
#         modified:   docker-compose.dev.yml
#         modified:   docker-compose.generated.yml
#         modified:   pyproject.toml
#         modified:   ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx
#         modified:   ui-apps/service-gen-saas/app/page.tsx
#         modified:   vendor/postgres/.env
#         modified:   vendor/prefect/.env
# 		git add .env.local Makefile docker-compose.dev.yml docker-compose.generated.yml pyproject.toml "vendor/postgres/.env" "vendor/prefect/.env"

#	sudo nano /etc/hosts
#	sudo code /etc/hosts
#	echo "127.0.0.1 keycloak.local prefect.local servicegen.local" | sudo tee -a /etc/hosts
#	sudo sed -i '' '/keycloak.local/d' /etc/hosts
#	127.0.0.1 app.servicegen.local api.servicegen.local auth.servicegen.local prefect.servicegen.local
#	echo "127.0.0.1 api.servicegen.local saas.servicegen.local keycloak.servicegen.local prefect.servicegen.local bot.servicegen.local agentwkspace.servicegen.local" | sudo tee -a /etc/hosts