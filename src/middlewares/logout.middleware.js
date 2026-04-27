const logout = (req, res)=>{
    res.clearCookie('token').json({ message: 'Logged out successfully' });
}
module.exports = { logout };