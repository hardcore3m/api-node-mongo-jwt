// – /api/test/all retorna acesso público
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

// – /api/test/user retorna conteúdo para usuários logados independentemente da role
exports.userBoard = (req, res) => {
    let stats = {
        path: req.path,
        method: req.method,
        user: req.userId
    }
    console.log(req.userId);

    res.status(200).send(stats);
};

// – /api/test/mod retorna conteúdo que pode ser acessado por moderadores
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

// – /api/test/admin retorna conteúdo acessível somante a administradores
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};