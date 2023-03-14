import Head from 'next/head'
import { Inter } from 'next/font/google'
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import type {Article} from "@shl/pages/api/korkki";
import {Button, HStack, Input} from "@chakra-ui/react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [text, setText] = useState("");
  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const resp = await fetch(`/api/korkki?url=${url}`)
      return await resp.json() as Article
    },
  })
  function hae() {
    mutation.mutate(text)
  }

  return (
    <>
      <Head>
        <title>SHL Tikapuut</title>
        <meta name="description" content="SHL Tikapuut"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main>


        <HStack maxW={640} padding={2}>
          <Input placeholder='SHL Osoite' value={text} onChange={(e) => setText(e.target.value)} />
          <Button colorScheme='blue' onClick={() => hae()}>Etsippä</Button>
        </HStack>

        {mutation.isSuccess && (
          <div style={{maxWidth: 640}}>
            <div dangerouslySetInnerHTML={{__html: mutation.data.post}}/>
          </div>
        )}

      </main>
    </>
  );
}
