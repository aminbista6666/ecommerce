import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Badge,
  NumberInputStepper,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import { Rating, NavBar } from "../components";
import React, { useState, useEffect, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useParams, useNavigate } from "react-router-dom";
import { productAPIUrl } from "../baseURL";
import { addToCart } from "../api";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const handleChange = (value) => setQuantity(value);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      const res = await fetch(`${productAPIUrl}/detail/${slug}/`).then(response => {
        response.json().then(jsonData => {
          setData(jsonData)
          setIsLoading(false)
        }).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
      setIsLoading(true)
    }
    fetchDetail()
  }, []);
  // function handleChange(e) {
  //   console.log(e.target.value)
  // }

  return (
    <>
      <NavBar />
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Flex>
            <Carousel autoPlay={true}>
              {data.images !== undefined ? data.images.map((item, index) => {
                return (
                  <div key={index}>
                  <Image
                    rounded={"md"}
                    alt={"product image"}
                    src={item.image}
                    fit={"cover"}
                    align={"center"}
                    w={"100%"}
                    h={{ base: "100%", sm: "400px", lg: "500px" }}
                    loading="lazy"
                  />
                </div>
                )
              }): <></>}
            </Carousel>
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              {data.quantity !== undefined &&
              data.quantity < 10 &&
              data.quantity !== 0 ? (
                <Badge colorScheme="yellow" sx={{ marginBottom: "10px" }}>
                  Only {data.quantity} left
                </Badge>
              ) : data.quantity === 0 ? (
                <Badge colorScheme="red" sx={{ marginBottom: "10px" }}>
                  Out of stock
                </Badge>
              ) : (
                <span></span>
              )}
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {data.title}
              </Heading>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={300}
                fontSize={"2xl"}
              >
                {data.discount === 0 ? (
                  <span>Rs.{data.price}</span>
                ) : (
                  <span>
                    <strike style={{ marginRight: "8px", color: "gray" }}>
                      $.{data.price}
                    </strike>
                    <span style={{ fontWeight: "700" }}>
                      $.{data.net_price}
                    </span>{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color: "tomato",
                        marginLeft: "20px",
                      }}
                    >
                      {data.discount_percent}% off.
                    </span>
                  </span>
                )}
              </Text>
            </Box>

            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text fontSize={"lg"}>{data.description}</Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={useColorModeValue("yellow.500", "yellow.300")}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Reviews
                </Text>

                <Box>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <Rating rating={data.rating} />
                    <span style={{ paddingTop: "10px", color: "gray" }}>
                      {data.reviews !== undefined ? data.reviews.length : 0}{" "}
                      {data.reviews !== undefined && data.reviews.length === 1
                        ? "review"
                        : "reviews"}
                    </span>
                  </div>
                </Box>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color="gray"
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  By {data.seller}
                </Text>
              </Box>
            </Stack>

            {data.quantity !== undefined && data.quantity === 0 ? (
              <Stack direction="row" mt={8}>
                <Button
                  rounded={"none"}
                  w={"full"}
                  size={"lg"}
                  py={"7"}
                  bg="gray.900"
                  color="white"
                  textTransform={"uppercase"}
                  _hover={{
                    transform: "translateY(2px)",
                    boxShadow: "lg",
                  }}
                  disabled
                >
                  Add to cart
                </Button>
              </Stack>
            ) : (
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color="gray"
                  fontWeight={"400"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  QUANTITY
                </Text>
                <NumberInput
                  value={quantity}
                  size="md"
                  maxW={24}
                  defaultValue={1}
                  min={1}
                  max={data.quantity !== undefined && data.quantity}
                  onChange={handleChange}
                >
                  <NumberInputField />
                  <NumberInputStepper onChange={(e) => handleChange(e)}>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Stack direction="row" mt={8}>
                  <Button
                    rounded={"none"}
                    w={"full"}
                    size={"lg"}
                    py={"7"}
                    bg="gray.900"
                    color="white"
                    textTransform={"uppercase"}
                    _hover={{
                      transform: "translateY(2px)",
                      boxShadow: "lg",
                    }}
                    onClick={() => addToCart(data.slug, quantity).then(res => {navigate('/cart')})}
                  >
                    Add to cart
                  </Button>
                </Stack>
              </Box>
            )}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <MdLocalShipping />
              <Text>2-3 business days delivery</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
}
