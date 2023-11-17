"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartsController_1 = __importDefault(require("./cartsController"));
const databaseConnection_1 = __importDefault(require("./databaseConnection"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/carts', cartsController_1.default);
const databaseConnection = new databaseConnection_1.default();
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield databaseConnection.executeQuery('SELECT 1'); // Check database connection
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
});
initializeServer();
