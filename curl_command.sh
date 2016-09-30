#!/bin/sh

curl -X POST -H "Content-Type:application/graphql" -d "query { todos { title } }" localhost:3000

