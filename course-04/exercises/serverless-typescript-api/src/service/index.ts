import dynamoDBClient from "../models/"
import  TodoServerice  from "./service"

const todoService = new TodoServerice(dynamoDBClient());
export default todoService;