const authService = require('../services/auth.service')

const register = async (req,res)=>{
   try {
    const user = await authService.registerUser(req.body)

    res.status(201).json({
        success:true,
        message:"User Registered Successfully",
        data:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    })
   } catch (error) {
    const status = error.message === "Email Already exist" ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
   }
}

const login = async (req,res)=>{
    try {
        const { user, token } = await authService.loginUser(req.body)

        res.status(200).json({
            success: true,
            message: "Login Success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        const status = (error.message === "User Not Found" || error.message === "Invalid Credentials") ? 401 : 500;
        res.status(status).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {register,login}