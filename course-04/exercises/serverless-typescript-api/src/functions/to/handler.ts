import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
let bodyParser = require('body-parser')
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 } from "uuid"
import todoService  from "../../service/";

export const getAllTodos = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const todos = await todoService.getAllTodos()
    return formatJSONResponse({
        todos
    })
})

export const createTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4()
        const bodyresult = bodyParser(event.body)
        const todo = await todoService.createTodo({
            todoId: id,
            title: bodyresult.title,
            description: bodyresult.description,
            createdAt: new Date().toISOString(),
            status: false
        })
        return formatJSONResponse({
            todo
        })
    } catch (error) {
        return formatJSONResponse({
            status: 500,
            message :error
        })
    }
})
export const updateTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const todo = await todoService.updateTodo(id)
        return formatJSONResponse({
            todo ,id
        })
    } catch (error) {
        return formatJSONResponse({
            status: 500,
            message: error
        })
    }
})
export const deleteTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const todo = await todoService.deleteTodo(id)
        return formatJSONResponse({
            todo, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})