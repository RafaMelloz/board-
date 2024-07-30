import toast from "react-hot-toast";

export const alertSuccess = (text: string) =>{
    toast.success(text, {
        duration: 1500,
        position: 'top-center',

        style: {
            background: '#e9ffe6',
            fontWeight: '600'
        }
    });
}



export const alertError = (text: string) => {
    toast.error(text, {
        duration: 1500,
        position: 'top-center',

        style: {
            background: '#ffe6e6',
            fontWeight: '600'
        }
    });
}

