const config = require("../config/auth.config");
const db = require("../models");
const {
    user: User,
    role: Role,
    refreshToken: RefreshToken
} = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Cria novo 'User' no mongoDB database(a role 'User' é declarada como defaut).
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        if (req.body.roles) {
            Role.find({
                name: {
                    $in: req.body.roles
                },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({
                        message: err
                        });
                        return;
                    }
                    user.roles = roles.map((role) => role._id);
                    user.save((err) => {
                        if (err) {
                            res.status(500).send({
                                message: err
                            });
                            return;
                        }
                        res.send({
                            message: "User was registered successfully!"
                        });
                    });
                }
            );
        } else {
            Role.findOne({
                name: "user"
            }, (err, role) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                    return;
                }
                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                        return;
                    }
                    res.send({
                        message: "User was registered successfully!"
                    });
                });
            });
        }
    });
};




// generate a token using jsonwebtoken
// return user information & access Token

exports.signin = (req, res) => {

    // Localiza o username da requisição no banco de dados
    User.findOne({
            username: req.body.username,
        })
        .populate("roles", "-__v")
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            
            // Se o usuário não existir retorna erro 404
            if (!user) {
                return res.status(404).send({
                    message: "User Not found."
                });
            }
            
            // compara as senhas usando o bcrypt
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            
            // Se a senha estiver errada retorna erro 401
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }
            
            let authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            // Gera um token
            let token = jwt.sign({
                id: user.id,roles:authorities
            }, config.secret, {
                expiresIn: config.jwtExpiration,
            });
            let refreshToken = await RefreshToken.createToken(user);
            
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
            });
        });
};

// Reinicializa a sessão com o refreshToken
exports.refreshToken = async (req, res) => {
    const {
        refreshToken: requestToken
    } = req.body;

    // Verifica se existe refresh token, se não retorna erro 403
    if (requestToken == null) {
        return res.status(403).json({
            message: "Refresh Token is required!"
        });
    }
    try {

        // Busca o refreshToken no database
        let refreshToken = await RefreshToken.findOne({
            token: requestToken
        });

        // Se o refreshToken não existir no database retorna erro 403
        if (!refreshToken) {
            res.status(403).json({
                message: "Refresh token is not in database!"
            });
            return;
        }

        // Se o refreshToken estiver expirado ele apaga do database e retorna erro 403
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, {
                useFindAndModify: false
            }).exec();

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        let newAccessToken = jwt.sign({
            id: refreshToken.user._id
        }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({
            message: err
        });
    }
};


// Finaliza a sessão de usuário
exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({
            message: "You've been signed out!"
        });
    } catch (err) {
        this.next(err);
    }
};