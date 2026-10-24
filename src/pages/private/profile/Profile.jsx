import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/lib/apiClient";
import { fetchAllPages, errorMessage } from "../roadmap/roadmapApi";
import { useEffect, useState } from "react";

export function Profile() {

    const { usuario, verificarSesion } = useAuth()
    const [stats, setStats] = useState(null)
    const [statsError, setStatsError] = useState("")
    const [saveError, setSaveError] = useState("")
    const [saving, setSaving] = useState(false)
    useEffect(() => {
        if (!usuario?.id) return;
        const controller = new AbortController();
        const options = { signal: controller.signal };
        Promise.all([
            fetchAllPages("/post/user", options, apiFetch),
            fetchAllPages("/comment", options, apiFetch),
            fetchAllPages("/roadmap/user", options, apiFetch),
        ]).then(([posts, comments, roadmaps]) => {
            if (controller.signal.aborted) return;
            setStats({
                posts: posts.length,
                replies: comments.filter(comment => String(comment.user_id) === String(usuario.id)).length,
                votes: posts.reduce((sum, post) => sum + (post.votesCount ?? 0), 0),
                roadmaps: roadmaps.length,
            });
        }).catch(() => {
            if (!controller.signal.aborted) setStatsError("No se pudieron cargar las estadísticas.");
        });
        return () => controller.abort();
    }, [usuario?.id])
    const [edit, setEdit] = useState(false)
    const [form, setForm] = useState({
        name: usuario?.name ?? '',
        email: usuario?.email ?? '',
        university: usuario?.university ?? '',
        biography: usuario?.bio ?? ''
    })

    const displayedForm = edit ? form : {
        name: usuario?.name ?? '', email: usuario?.email ?? '',
        university: usuario?.university ?? '', biography: usuario?.bio ?? ''
    }

    function startEditing() {
        setForm(displayedForm);
        setSaveError("");
        setEdit(true);
    }

    function handleChange(event) {
        const {name , value} = event.target
        setForm(previousForm => ({ ...previousForm, [name]: value }))
    }

    async function handleEditUser() {
        if (saving) return;
        setSaving(true);
        setSaveError("");
        try {
            await apiFetch.put(`/user/${usuario.id}`, form)
            await verificarSesion()
            setEdit(false)
        } catch (error) {
            setSaveError(errorMessage(error, "No se pudo guardar el perfil."))
        } finally { setSaving(false) }
    }

    function cancelar() {
        setForm({

            name: usuario?.name ?? '',
            email: usuario?.email ?? '',
            university: usuario?.university ?? '',
            biography: usuario?.bio ?? ''

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
                                <AvatarFallback className={'bg-blue-500 text-white'}>{(usuario?.name || "?").split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-2xl">{displayedForm.name}</span>
                                {/* <span className="text-sm text-gray-300">
                                    Ingeniería en Sistemas · 5° semestre
                                </span> */}
                                <span className="text-sm text-gray-300">
                                    {usuario?.university || ''}
                                </span>
                            </div>


                        </div>
                    </CardTitle>
                    <CardAction>

                    </CardAction>
                </CardHeader>
                {statsError && <p role="alert" className="px-6 text-sm text-red-300">{statsError}</p>}
                <CardFooter className={'grid grid-cols-2 gap-2'}>
                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">{stats?.posts ?? "?"}</span>
                        <span>Hilos creados</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">{stats?.replies ?? "?"}</span>
                        <span>Respuestas</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">{stats?.votes ?? "?"}</span>
                        <span>Votos recibidos</span>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                        <span className="text-xl font-bold">{stats?.roadmaps ?? "?"}</span>
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
                            <FieldLabel htmlFor="name">Nombre Completo</FieldLabel>
                            <Input className={'bg-slate-50'} id="name" name="name" type="text" onChange={handleChange} value={displayedForm.name} disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                            <Input id="email" name="email" type="email" value={displayedForm.email} onChange={handleChange} disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="universidad">Universidad</FieldLabel>
                            <Input id="universidad" name="university" type="text" value={displayedForm.university} onChange={handleChange} placeholder="Tu universidad" disabled={!edit} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-optional-comments">
                                Bio / Sobre Mi
                            </FieldLabel>
                            <Textarea
                                id="checkout-7j9-optional-comments"
                                placeholder="Cuéntanos sobre ti"
                                className="resize-none"
                                onChange={handleChange}
                                name="biography"
                                value={displayedForm.biography}
                                disabled={!edit}
                            />
                        </Field>
                        
                    </FieldGroup>
                    
                </FieldSet>
                {saveError && <p role="alert" className="text-red-300">{saveError}</p>}
                {edit ? (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={cancelar} disabled={saving}>Cancelar</Button>
                            <Button size="sm" className="bg-blue-500 rounded-3xl text-white" onClick={handleEditUser} disabled={saving}>Guardar</Button>
                        </div>
                    ) : (
                        <Button size="sm" className="bg-blue-500 rounded-3xl text-white" onClick={startEditing}>
                            Editar perfil
                        </Button>
                    )}
            </div>
        </article>
    )
}