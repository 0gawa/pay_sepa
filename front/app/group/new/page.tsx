"use client"

import {Button, Form, Input} from "@heroui/react";

export default function Page() {
  return (
    <div>
      <Form /*className="w-full max-w-xs" validationErrors={errors} onSubmit={onSubmit}*/>
        <Input
          isRequired
          //isDisabled={isLoading}
          label="名前"
          labelPlacement="outside"
          placeholder="例）太郎"
        />
        <Button color="primary" /*isLoading={isLoading}*/ type="submit">
          作成
        </Button>
      </Form>
    </div>
  );
}
