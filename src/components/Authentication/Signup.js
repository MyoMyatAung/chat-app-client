import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function Signup() {
  const toast = useToast();

  const history = useHistory();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    if (e.target.name === "profilePic") {
      setData((prev) => ({ ...prev, profilePic: e.target.files[0] }));
    } else {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleShowPassword = (e) => {
    setShowPassword((prev) => ({
      ...prev,
      [e.target.name]: !prev[e.target.name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      toast({
        title: "Please fill all field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password doesn't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("profilePic", data.profilePic);
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(`${url}/user/signup`, {
        method: "POST",
        body: formData,
      });
      const { data: resData } = await response.json();
      localStorage.setItem("user", JSON.stringify(resData));
      localStorage.setItem("token", resData.token);
      toast({
        title: "Registered successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="5px">
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={data.name}
            placeholder="Eg. John Wick"
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input
            name="email"
            value={data.email}
            placeholder="Eg. yourname@you.com"
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              value={data.password}
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            <InputRightElement width="4.5rem">
              <Button
                onClick={handleShowPassword}
                name="password"
                h="1.75rem"
                size="sm"
              >
                {showPassword.password ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              name="confirmPassword"
              value={data.confirmPassword}
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            <InputRightElement width="4.5rem">
              <Button
                onClick={handleShowPassword}
                name="confirmPassword"
                h="1.75rem"
                size="sm"
              >
                {showPassword.confirmPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="profilePic" isRequired>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            name="profilePic"
            value={data.profilePic.filename}
            accept="image/*"
            placeholder="Eg. yourname@you.com"
            onChange={handleOnChange}
          />
        </FormControl>
        <Button
          isLoading={loading}
          type="submit"
          colorScheme="blue"
          width="100%"
        >
          {loading ? "Saving ....." : `Sign Up`}
        </Button>
      </VStack>
    </form>
  );
}

export default Signup;
