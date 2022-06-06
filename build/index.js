"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
var _a;
Object.defineProperty(exports, "__esModule", {value: true});
// * App entry
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const commands_1 = __importDefault(require("./routes/commands"));
const ErrorHandler_1 = require("./middlewares/ErrorHandler");
var cors = require('cors');
const router = (0, express_1.default)();
// Logging for development debugging
router.use((0, morgan_1.default)('dev'));
// Parse the request
router.use(express_1.default.urlencoded({extended: false}));
// Dealing with json body
router.use(express_1.default.json());
router.use(cors());
// // Api configuration
// router.use((req, res, next) => {
//     // Allow Cors
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
//     // set the CORS method headers
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', '*');
//         return res.status(200).json({});
//     }
//     next();
// })
// Routes
router.use('/', commands_1.default);
// Error Handling
router.use(ErrorHandler_1.logError);
router.use(ErrorHandler_1.returnError);
// Server
const httpServer = http_1.default.createServer(router);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 9090;
httpServer.listen(PORT, () => console.log(`The Ledis server is started and running on port ${PORT}`));
