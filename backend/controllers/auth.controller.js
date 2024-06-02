import Student from '../models/student.model';
import bcryptjs from 'bcryptjs';


export const signup = async(req,res)=>{
   const {name, email, password } = req.body

   if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newStudent = new Student({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await newStudent.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
}
