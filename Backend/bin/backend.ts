#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BookmarkStack } from "../lib/backend-stack";

const app = new cdk.App();
new BookmarkStack(app, "BookmarkStack", { env: { region: "us-east-1" } });
