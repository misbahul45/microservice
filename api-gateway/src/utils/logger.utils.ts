import winston from "winston";

const Logger=winston.createLogger({
    level:process.env.NODE_ENV==="PRODUCTION"?"info":"debug",
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack:true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta:{ service:"api-gateway" },
    transports:[
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename:"logs/error.log", level:"error" }),
        new winston.transports.File({ filename:"logs/combine.log" })

    ]
})

export default Logger