using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using API.MiddleWare;
using API.SignalR;
using Application;
using Application.Activities;
using Application.Interfaces;
using Application.Profiles;
using MediatR;
using AutoMapper;
using Domain.Identity;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Persistance;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseLazyLoadingProxies();
                options.UseSqlServer(
                    Configuration.GetConnectionString("MsSqlConnection"));
            });
            
            services.AddCors(options =>
            {
                options.AddPolicy("CorsAllowAll",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000");
                        builder.AllowAnyHeader();
                        builder.AllowAnyMethod();
                        builder.AllowCredentials();
                    });
            });

            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler));
            services.AddSignalR();
            services.AddMvc(options =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                options.Filters.Add(new AuthorizeFilter(policy));
                
            }).AddFluentValidation(config=> 
                config.RegisterValidatorsFromAssemblyContaining<Create>());
            
            
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<AppDbContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SigningKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
                AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience= false,
                        ValidateIssuer = false
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            //receiving jwt token as a request header from client becayse the chatHub is not a HTTP request
                            //Protocol
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });
            services.AddScoped<IJWTGenerator, JWTGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            UpdateDataBase(app, env, Configuration);
            app.UseMiddleware<ErrorHandlingMiddleWare>();
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsAllowAll");

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
        
        private static void UpdateDataBase(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration configuration)
        {
            // give me the scoped services (everyhting created by it will be closed at the end of service scope life).
            using var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            var logger = serviceScope.ServiceProvider.GetService<ILogger<Startup>>();
            using var context = serviceScope.ServiceProvider.GetService<AppDbContext>();
            using var userManager = serviceScope.ServiceProvider.GetService<UserManager<AppUser>>();

            if (configuration.GetValue<bool>("DataInitialization:DropDatabase"))
            {
                logger.LogInformation("DropDatabase");
                DataBaseSeedHandler.DeleteDatabase(context);
            }
            if (configuration.GetValue<bool>("DataInitialization:MigrateDatabase"))
            {
                logger.LogInformation("MigrateDatabase");
                DataBaseSeedHandler.MigrateDatabase(context);
            }
            
            if (configuration.GetValue<bool>("DataInitialization:SeedIdentity"))
            { 
                logger.LogInformation("SeedIdentity");
               DataBaseSeedHandler.SeedIdentity(context, userManager).Wait();
            }
            
            if (configuration.GetValue<bool>("DataInitialization:SeedData"))
            {
                logger.LogInformation("SeedData");
                DataBaseSeedHandler.SeedData(context);
            }

        }
    }
}
