import { useForm } from "react-hook-form"
import google from "../assets/google.svg"
import apple from "../assets/apple.svg"
import facebook from "../assets/facebook.svg"



export default function LoginForm() {

    const { watch, register, handleSubmit, formState :{errors} } = useForm()
    const onSubmit = (data) => { console.log(data) }
    console.log(watch("email")); 
    return (
        
        <form className="text-left w-full mt-5 " onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="Correo"
                className={`${errors.email && "border-red-500"} mb-6 w-full px-2 py-2 rounded-xl border-2 border-gray-300 focus:border-sand focus:ring-2 focus:ring-sand transition-all duration-200 bg-white shadow-sm  placeholder-gray-400 outline-none`}
                {...register("email", {required : true})}
            />
            <input
                type="text"
                placeholder="Pasword"
                className={`${errors.password && "border-red-500"} mb-6 w-full px-2 py-2 rounded-xl border-2 border-gray-300 focus:border-sand focus:ring-2 focus:ring-sand transition-all duration-200 bg-white shadow-sm  placeholder-gray-400 outline-none`}
                {...register("password", {required : true})}
            />
            <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold text-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                Iniciar sesión
            </button>
            <button
                type="submit"
                className="flex items-center justify-center w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold text-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                <img src={google} className="align-bottom" alt="Google" width="24" height="24" />
                <span className="ml-2">Google</span>
            </button>
            <button
                type="submit"
                className="flex items-center justify-center w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold text-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                <img src={apple} className="align-bottom" alt="Google" width="24" height="24" />
                <span className="ml-2">Apple</span>
            </button>
            <button
                type="submit"
                className="flex items-center justify-center w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold text-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                <img src={facebook} className="align-bottom" alt="Google" width="22" height="22" />
                <span className="ml-2">Facebook</span>
            </button>
            
        </form>
    )

}