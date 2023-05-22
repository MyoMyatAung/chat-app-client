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

function Login() {
  const toast = useToast();

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e) => {
    setShowPassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleGuestLogin = (e) => {
    setData({ email: "guest@gmail.com", password: "123456" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/user/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          const { msg } = await response.json();
          throw new Error(msg);
        } else {
          throw new Error("Something went wrong");
        }
      }
      const { data: resData } = await response.json();
      localStorage.setItem("user", JSON.stringify(resData));
      localStorage.setItem("token", resData.token);
      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Login fail",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack>
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
              type={showPassword ? "text" : "password"}
              value={data.password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            <InputRightElement width="4.5rem">
              <Button onClick={handleShowPassword} h="1.75rem" size="sm">
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          isLoading={loading}
          type="submit"
          colorScheme="blue"
          width="100%"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
        <Button onClick={handleGuestLogin} colorScheme="red" width="100%">
          Sign In with guest
        </Button>
      </VStack>
    </form>
  );
}

export default Login;
