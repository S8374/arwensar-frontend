
import { useAddContactMutation } from "@/redux/features/contact/contact.api";
import { contactFormSchema, type ContactFormData } from "@/validation/contactValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useContactForm = () => {
  const [, { isLoading, isSuccess, isError }] = useAddContactMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log("Form data submitted:", data);
      // Uncomment the next line if you want to actually send the data to the API
      // await addContact(data).unwrap();
      reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
  };
};