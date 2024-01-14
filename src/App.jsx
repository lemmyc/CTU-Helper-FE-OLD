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
                      minWidth="480px"
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
            <Heading as="h1" size="md" m={[2, 3]}>
              Câu trả lời
            </Heading>
            <Text fontSize="xl" m={[2, 2]} maxW="640px" textAlign="justify">
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
