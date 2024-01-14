import { useEffect, useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import "./App.css";

function App() {
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [docs, setDocs] = useState([]);
  function validateQuestion(value) {
    let error;
    if (!value) {
      error = "Câu hỏi không được để trống";
    }
    return error;
  }
  // useEffect(()=>{

  // })
  return (
    <>
      <div className="container" style={{margin:"8px"}}>
        <Heading as="h1" size="3xl" m={[2, 3]}>
          CTU-Helper
        </Heading>
        <Text fontSize="xl" m={[1, 2]}>
          Hỏi đáp những thông tin liên quan đến Quy chế học vụ của ĐHCT
        </Text>
        <Formik
          initialValues={{ question: "" }}
          onSubmit={(values, actions) => {
            setQuestion(values.question);

            fetch("https://right-willing-pika.ngrok-free.app/get-response", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                let formattedResponse = data.response.replace(/(?:\r\n|\r|\n)/g, '<br>');
                setResponse(formattedResponse);
                setDocs(data.docs);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {(props) => (
            <Form>
              <Field name="question" validate={validateQuestion}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.question && form.touched.question}
                  >
                    <FormLabel>Câu hỏi</FormLabel>
                    <Input
                      {...field}
                      width={{ base: "360px", md: "640px" }}
                      placeholder="Thời gian học buổi sáng ?"
                    />
                    <FormErrorMessage>{form.errors.question}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme="teal"
                // eslint-disable-next-line react/prop-types
                isLoading={props.isSubmitting}
                type="submit"
              >
                Đồng ý
              </Button>
            </Form>
          )}
        </Formik>
        {response ? (
          <>
            <Text as="h1" fontSize="xl" my={[2, 3]}>
              {question}
            </Text>
            <Heading as="h1" size="md" my={[2, 3]}>
              Câu trả lời
            </Heading>
            <Text fontSize="xl" my={[2, 3]} maxW="640px" textAlign="justify">
              <div dangerouslySetInnerHTML={{ __html: response }} />
            </Text>
            
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
