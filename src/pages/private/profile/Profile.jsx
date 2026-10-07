import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/lib/apiClient";
import { useState } from "react";

export function Profile() {

    const { usuario, verificarSesion } = useAuth()
    const [edit, setEdit] = useState(false)
    const [form, setForm] = useState({
        name: usuario.name ?? '',
        email: usuario.email ?? '',
        university: usuario.university ?? '',
        biography: usuario.bio ?? ''
    })

    function handleChange(event) {
        const {name , value} = event.target
        setForm({ ...form, [name]: value })
    }

    async function handleEditUser() {
        try {
            await apiFetch.put(`/user/${usuario.id}`, form)
            await verificarSesion()
            setEdit(false)
        } catch (error) {
            console.error(error)
        }
    }

    function cancelar() {
        setForm({

            name: usuario.name ?? '',
            email: usuario.email ?? '',
            university: usuario.university ?? '',
            biography: usuario.bio ?? ''

        })
        setEdit(false)
    }


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
                                <span className="text-2xl">{form.name}</span>
                                {/* <span className="text-sm text-gray-300">
                                    Ingeniería en Sistemas · 5° semestre
                                </span> */}
                                <span className="text-sm text-gray-300">
                                    {usuario.university || ''}
                                </span>
                            </div>


                        </div>
                    </CardTitle>
                    <CardAction>

                    </CardAction>
                </CardHeader>
                <CardFooter className={'grid grid-cols-2 gap-2'}>
                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">4</span>
                        <span>Hilos creados</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">18</span>
                        <span>Respuestas</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">67</span>
                        <span>Votos recibidos</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">2</span>
                        <span>Roadmaps</span>
                    </div>

                </CardFooter>
            </Card>

            {/* <Tabs defaultValue="perfil">
                <TabsList>
                    <TabsTrigger value="perfil">Mi perfil</TabsTrigger>
                    <TabsTrigger value="carrera">
                        Mi carrera
                    </TabsTrigger>
                    <TabsTrigger value="configuracion">
                        Configuración
                    </TabsTrigger>
                </TabsList>
            </Tabs> */}

            <div className="bg-black/70 mx-auto w-full max-w-3xl  rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center gap-4 justify-center p-10">
                
                <FieldSet className="w-full max-w-3xl">
                    
                    <FieldLegend>Información personal</FieldLegend>

                    
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="nombre">Nombre Completo</FieldLabel>
                            <Input className={'bg-slate-50'} id="name" type="text" onChange={handleChange} value={form.name} disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="correo">Correo electrónico</FieldLabel>
                            <Input id="email" type="email" value={form.email} onChange={handleChange} disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="universidad">Universidad</FieldLabel>
                            <Input id="universidad" name="university" type="text" value={form.university} onChange={handleChange} placeholder="Universidad X" disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-optional-comments">
                                Bio / Sobre Mi
                            </FieldLabel>
                            <Textarea
                                id="checkout-7j9-optional-comments"
                                placeholder="Estudiante de Ingeniería en Sistemas apasionado por el desarrollo backend y la inteligencia artificial. Buscando mi primer empleo tech."
                                className="resize-none"
                                onChange={handleChange}
                                name="biography"
                                value={form.biography}
                                disabled={!edit}
                            />
                        </Field>
                        
                    </FieldGroup>
                    
                </FieldSet>
                {edit ? (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={cancelar}>Cancelar</Button>
                            <Button size="sm" className="bg-blue-500 rounded-3xl text-white" onClick={handleEditUser}>Guardar</Button>
                        </div>
                    ) : (
                        <Button size="sm" className="bg-blue-500 rounded-3xl text-white" onClick={() => setEdit(true)}>
                            Editar perfil
                        </Button>
                    )}
            </div>
        </article>
    )
}