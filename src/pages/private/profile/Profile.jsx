import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function Profile() {
    return (
        <article className="flex flex-col gap-2 items-center">


            <Card className={'mx-auto w-full max-w-3xl bg-black/70'}>
                <CardHeader>
                    <CardTitle className={'flex flex-row gap-6 items-center justify-between'}>

                        <div className="flex flex-row justify-between gap-6 items-center">
                            <Avatar size="lg">
                                <AvatarImage alt="USER" className={'bg-blue-500'} />
                                <AvatarFallback className={'bg-blue-500 text-white'}>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-2xl">Pedro Suarez</span>
                                <span className="text-sm text-gray-300">
                                    Ingeniería en Sistemas · 5° semestre
                                </span>
                                <span className="text-sm text-gray-300">
                                    Universidad Tecnológica del Perú
                                </span>
                            </div>


                        </div>
                        <Button size="sm" className="bg-blue-500 rounded-3xl text-white">
                            Editar perfil
                        </Button>
                    </CardTitle>
                    <CardAction>

                    </CardAction>
                </CardHeader>
                <CardFooter className={'flex justify-around'}>
                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-xl font-bold">4</span>
                        <span>Hilos creados</span>
                    </div>

                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-xl font-bold">18</span>
                        <span>Respuestas</span>
                    </div>

                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-xl font-bold">67</span>
                        <span>Votos recibidos</span>
                    </div>

                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-xl font-bold">2</span>
                        <span>Roadmaps</span>
                    </div>

                </CardFooter>
            </Card>

            <Tabs defaultValue="perfil">
                <TabsList>
                    <TabsTrigger value="perfil">Mi perfil</TabsTrigger>
                    <TabsTrigger value="carrera">
                        Mi carrera
                    </TabsTrigger>
                    <TabsTrigger value="configuracion">
                        Configuración
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="bg-black/70 mx-auto w-full max-w-3xl rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center p-10">
                <FieldSet className="w-full max-w-sm">
                    <FieldLegend>Información personal</FieldLegend>
                    <FieldGroup>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                                <Input className={'bg-slate-50'} id="nombre" type="text" placeholder="Sebastian" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="apellido">Apellido</FieldLabel>
                                <Input id="apellido" type="text" placeholder="Barreño" />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="correo">Correo electrónico</FieldLabel>
                            <Input id="correo" type="email" placeholder="sebastian.barreto@unal.edu.co" />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="universidad">Universidad</FieldLabel>
                                <Input id="universidad" type="text" placeholder="Universidad tecnológica de Colombia" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="semestre">Semestre</FieldLabel>
                                <Input id="semestre" type="text" placeholder="5to semestre" />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-optional-comments">
                                Bio / Sobre Mi
                            </FieldLabel>
                            <Textarea
                                id="checkout-7j9-optional-comments"
                                placeholder="Estudiante de Ingeniería en Sistemas apasionado por el desarrollo backend y la inteligencia artificial. Buscando mi primer empleo tech."
                                className="resize-none"

                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
        </article>
    )
}