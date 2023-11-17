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
const promise_1 = __importDefault(require("mysql2/promise"));
class DatabaseConnection {
    constructor() {
        this.config = {
            host: 'blackthorntestdb.ctyurw8kiwbo.eu-north-1.rds.amazonaws.com',
            user: 'admin',
            password: 'admin123',
            database: 'ShoppingCartDB',
        };
        this.pool = promise_1.default.createPool(this.config);
    }
    executeQuery(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const [rows] = yield connection.execute(sql, params);
                return rows;
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.default = DatabaseConnection;
