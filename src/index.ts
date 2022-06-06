// * App entry
import http from 'http';
import express, {Express} from "express";
import morgan from "morgan";
import routes from './routes/commands';
import {logError, logErrorMiddleware, returnError} from "./middlewares/ErrorHandler";

var cors = require('cors');
const router: Express = express();


// Logging for development debugging
router.use(morgan('dev'));

// Parse the request
router.use(express.urlencoded({extended: false}));

// Dealing with json body
router.use(express.json());

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
router.use('/', routes);

// Error Handling
router.use(logError);
router.use(returnError)

// Server
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 9090;

httpServer.listen(PORT, () => console.log(`The Ledis server is started and running on port ${PORT}`));

