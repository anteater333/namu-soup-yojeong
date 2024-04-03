FROM denoland/deno:1.42.1

# The port that your application listens to.
EXPOSE ${HQ_PORT}

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts
RUN deno cache hq.ts

CMD ["task", "serve"]
