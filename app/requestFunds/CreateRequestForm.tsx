'use client';
import { Avatar } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { createFundsRequest } from '@/app/requestFunds/actions';
import { CurrencyType } from '@/lib/constants';
import { ServerFormStatus, type ServerFormStateType } from '@/lib/formUtil';
import { getEthRate } from '@/lib/server/bcUtil';
import {
  Card,
  CardBody,
  CardTitle,
  createListCollection,
  HStack,
  Input,
  InputAddon,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuShare } from 'react-icons/lu';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import {
  LinkExpiryOptions,
  RequestFundsFormSchema,
  TrustPeriodOptions,
} from './schemas';

const RequestFundsForm = () => {
  const { address } = useAccount();
  const formRef = useRef<HTMLFormElement>(null);
  const [serverState, formAction, isPending] = useActionState(
    createFundsRequest,
    {
      message: '',
      fields: {},
      errors: {},
      status: ServerFormStatus.INITIAL,
    } as ServerFormStateType
  );
  const {
    register,
    getValues,
    control,
    reset,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(RequestFundsFormSchema),
    defaultValues: {
      linkExpirySelect: ['1'],
      trustPeriodSelect: ['24'],
      trustPeriod: '24',
      linkExpiry: '1',
      usdAmount: 0,
      amount: 0,
      recipientAddress: address,
      currency: CurrencyType.ETH,
      notes: '',
      recipientName: '',
      recipientAvatar: '',
    },
    progressive: true,
  });

  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    if (serverState.status === ServerFormStatus.SUCCESS) {
      reset();
      console.log(
        'Funds request created:',
        serverState.returnData?.fundsRequest
      );
    }
  }, [serverState, reset]);

  useEffect(() => {
    async function fetchExchangeRate() {
      const rate = await getEthRate();
      setExchangeRate(rate);
    }

    fetchExchangeRate();
  }, []);

  const onUSDChange = () => {
    const usdAmount = getValues('usdAmount');
    const ethValue = usdAmount / exchangeRate;
    setValue('amount', ethValue, { shouldValidate: true });
  };

  const onETHChange = () => {
    const amount = getValues('amount');
    const usdValue = amount * exchangeRate;
    setValue('usdAmount', usdValue, { shouldValidate: true });
  };

  const onSubmit = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      startTransition(async () => {
        formAction(formData);
      });
    }
  };

  const linkExpiryList = createListCollection(LinkExpiryOptions);
  const trustPeriodList = createListCollection(TrustPeriodOptions);

  const { data: ensName } = useEnsName({ address });
  if (ensName) {
    setValue('recipientName', ensName);
  }
  const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });
  if (ensAvatar) {
    setValue('recipientAvatar', ensAvatar);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} //allows client side validation
      ref={formRef}
    >
      <Card.Root p={4} maxW={'md'}>
        <CardTitle>Recipient</CardTitle>
        <Card.Body>
          <Card.Description textWrap={'wrap'}>
            All funds collected by Paysmith will be sent into the following
            wallet upon expiry of the trust period.
          </Card.Description>
          <HStack mt={4}>
            <Avatar src={ensAvatar as string} name={ensName as string} />
            <Stack gap="0">
              <Text fontWeight="semibold" textStyle="sm">
                {ensName}
              </Text>
              <Text color="fg.muted" textStyle="xs">
                {address}
              </Text>
            </Stack>
          </HStack>
        </Card.Body>
      </Card.Root>

      <Input {...register('recipientAddress')} hidden />
      <Input {...register('recipientName')} hidden />
      <Input {...register('recipientAvatar')} hidden />
      <Card.Root p={4} maxW={'md'}>
        <CardTitle>Amount</CardTitle>
        <CardBody>
          <Field
            invalid
            mt={2}
            errorText={
              errors.amount?.message?.toString() ||
              serverState.errors.amount?.toString()
            }
          >
            <VStack>
              <HStack w="100%">
                <InputAddon>ETH</InputAddon>
                <Input
                  placeholder="0"
                  {...register('amount')}
                  onBlur={onETHChange}
                />
              </HStack>
              <HStack w="100%">
                <InputAddon>USD</InputAddon>
                <Input
                  placeholder="0"
                  {...register('usdAmount')}
                  onBlur={onUSDChange}
                />
              </HStack>
            </VStack>
          </Field>
        </CardBody>

        <CardTitle>Notes</CardTitle>
        <CardBody>
          <Field
            mt={2}
            errorText={
              errors.notes?.message?.toString() ||
              serverState.errors.notes?.toString()
            }
          >
            <Textarea {...register('notes')} autoresize />
          </Field>
        </CardBody>
      </Card.Root>
      <Card.Root p={4} maxW={'md'}>
        <CardTitle>Options</CardTitle>
        <CardBody>
          <Field
            label="Trust Period"
            errorText={
              errors.trustPeriodSelect?.message?.toString() ||
              serverState.errors.trustPeriod?.toString()
            }
            my={2}
          >
            <Controller
              control={control}
              name="trustPeriodSelect"
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    setValue(
                      'trustPeriod',
                      value[0] as '1' | '8' | '24' | '48' | '72' | 'NONE'
                    );
                    field.onChange(value);
                  }}
                  onInteractOutside={() => field.onBlur()}
                  collection={trustPeriodList}
                >
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent>
                    {TrustPeriodOptions.items.map(option => (
                      <SelectItem item={option} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>
          <input type="hidden" {...register('trustPeriod')} />
          <Field
            label="Request Expiry"
            errorText={
              errors.linkExpirySelect?.message?.toString() ||
              serverState.errors.linkExpiry?.toString()
            }
            my={2}
          >
            <Controller
              control={control}
              name="linkExpirySelect"
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    setValue(
                      'linkExpiry',
                      value[0] as '1' | '30' | '60' | '90' | '180'
                    );
                    field.onChange(value);
                  }}
                  onInteractOutside={() => field.onBlur()}
                  collection={linkExpiryList}
                >
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent>
                    {LinkExpiryOptions.items.map(option => (
                      <SelectItem item={option} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>
          <Button type="submit" mt={2} disabled={isPending}>
            <LuShare />
            Generate Link
          </Button>
        </CardBody>
      </Card.Root>
      <input type="hidden" {...register('linkExpiry')} />
    </form>
  );
};

export default RequestFundsForm;
